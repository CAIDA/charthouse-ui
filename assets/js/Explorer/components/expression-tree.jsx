import React from 'react';
import $ from 'jquery';
import 'jstree';

// TODO: Dialog
// TODO: ApiConnector
import Expression from '../utils/expression';
import HeirarchyExplorer from './hierarchy-explorer';
// TODO: FunctionBrowser
// TODO: jstree

const ExpressionTree = React.createClass({

    const: {
        CHANGE_DAMPER_DELAY: 100 //ms. How long to wait for other chained events before triggering a global change
    },

    propTypes: {
        expression: React.PropTypes.instanceOf(Expression),
        onChange: React.PropTypes.func,
        onSelectionChange: React.PropTypes.func,
        icons: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            expression: new Expression(),
            onChange: function (newExpression) {
            },
            onSelectionChange: function ($selectedNodes) {
            },
            icons: {
                func: "glyphicon glyphicon-cog",
                path: "fa fa-leaf",
                constant: "charthousicon-constant"
            }
        };
    },

    getInitialState: function () {
        return {
            functionSpecs: null
        }
    },

    componentDidMount: function () {
        var rThis = this;

        // Wrapped jQuery plugin
        var $tree = (this.$tree = $(this.refs.ExpressionTree.getDOMNode()));

        $tree.jstree({
            core: {
                check_callback: true,
                themes: {
                    //stripes: true
                    variant: "small",
                    dots: true
                }
            },
            types: {
                function: {
                    icon: "folder-color " + this.props.icons.func
                },
                path: {
                    icon: "leaf-color " + this.props.icons.path,
                    valid_children: "none"
                },
                constant: {
                    icon: "leaf-color " + this.props.icons.constant,
                    valid_children: "none"
                }
            },
            dnd: {
                check_while_dragging: true
            },
            plugins: ["types", "dnd"]
        });

        // Event handlers //

        // Node selected
        var _selectedNodeId;
        $tree.bind("select_node.jstree", function (e, data) {
            if (_selectedNodeId == data.node.id) { // Toggle selection on click selected node
                $tree.jstree('deselect_node', data.node);
                _selectedNodeId = null;
            } else {
                _selectedNodeId = data.node.id;
            }
            rThis.props.onSelectionChange(rThis.getSelected());
        });

        // Node double-clicked -> edit node
        $tree.bind("dblclick.jstree", function (e, data) {
            var nodeId = $(e.target).closest("li").attr('id');
            rThis.editNode(nodeId);
        });

        // Update constant data on edit
        $tree.on('set_text.jstree', function (event, evData) {
            var node = evData.obj;
            if (node.type == 'constant') {
                node.text = htmlDecode(node.text);
                node.data.value = node.text.trim();
                node.data.value = (!node.data.value.length || isNaN(node.data.value)) // Store numbers without quotes
                    ? node.data.value
                    : parseFloat(node.data.value);
            }

            // Use jQuery to decode html chars (&amp; > & , etc)
            function htmlDecode(str) {
                return $('<span>').html(str).text();
            }
        });

        // Prevent propagation up the dom of constant text edit events
        $tree.on('change', function (event) {
            event.stopPropagation();
        });

        // Trigger expression changes
        var changeEventDamper = false;
        $tree.on('create_node.jstree move_node.jstree delete_node.jstree rename_node.jstree', function (event, target) {
            // Ignore adding empty constants
            if (target.node.type == "constant" && event.type == "create_node" && !target.node.text) return;

            if (changeEventDamper !== false)
                clearTimeout(changeEventDamper);
            changeEventDamper = setTimeout(
                function () {
                    rThis.props.onChange(rThis._getExpression());
                    rThis._refreshArgsCounters();
                },
                rThis.const.CHANGE_DAMPER_DELAY
            );
        });

        // Deselect children nodes when closing folders, to avoid occlusion operation problems
        $tree.on('close_node.jstree', function (event, target) {
            rThis._getAllChildrenNodes(target.node).filter(function (c) {
                return c.state.selected;
            }).forEach(function (c) {
                $tree.jstree(true).deselect_node(c, false);
            });
            rThis.props.onSelectionChange(rThis.getSelected());
        });

        /////

        if (this.props.expression.getJson())
            this.addExpression(this.props.expression);

        this._loadFunctionSpecs();
    },

    componentDidUpdate: function (prevProps) {
        if (!this.props.expression.equals(prevProps.expression)
            && !this.props.expression.equals(this._getExpression())) {
            // Expression changed
            this._clear();
            this.addExpression(this.props.expression);
        }
    },

    componentWillUnmount: function () {
        // Destroy jQuery plugin
        var $elem = $(this.refs.ExpressionTree.getDOMNode());
        $.removeData($elem.get(0));
    },

    render: function () {
        return <div
            className="expression-tree"
            ref="ExpressionTree"
        />;
    },

    // Private methods
    _loadFunctionSpecs: function () {
        var rThis = this;
        var apiConnector = new ApiConnector();

        apiConnector.getFunctionSpecs(
            function (json) {
                rThis.setState({functionSpecs: json.data});

                // Refresh function descriptions already in tree
                rThis._getAllChildrenNodes()
                    .filter(function (n) {
                        return (n.type == 'function');
                    })
                    .forEach(function (n) {
                        rThis.$tree.jstree(true).rename_node(
                            n.id,
                            rThis._buildFunctionNodeHtml(n.data.func, n.data.args)
                        );
                    });

            },
            function () { // Error handle
            }
        );
    },

    _refreshArgsCounters: function () {
        var rThis = this;
        var $tree = this.$tree;
        this._getAllChildrenNodes()
            .filter(function (n) {
                return (n.type == 'function' && n.children.length != n.data.args);
            })
            .forEach(function (n) {
                n.data.args = n.children.length;
                $tree.jstree(true).rename_node(
                    n.id,
                    rThis._buildFunctionNodeHtml(n.data.func, n.data.args)
                );
            });
    },

    _buildFunctionNodeHtml: function (func, nArgs) {
        var specTxt = '';

        if (this.state.functionSpecs && this.state.functionSpecs.hasOwnProperty(func)) {
            var spec = this.state.functionSpecs[func];

            specTxt = spec.name + ': ' + func + '('
                + spec.args.map(function (arg) {
                    var argTxt = '<' + arg.type + '> ' + (arg.multiple ? '✲' : '') + arg.name;
                    return arg.mandatory ? argTxt : ('[' + argTxt + ']');
                }).join(', ')
                + ')';
        }

        return React.renderToStaticMarkup(<span title={specTxt}>{func}</span>)
            + '('
            + React.renderToStaticMarkup(<span
                className="badge"
                title={'Function has ' + nArgs + ' argument' + (nArgs == 1 ? '' : 's')}
            >{nArgs}</span>)
            + ')';
    },

    _expression2tree: function (exp) {
        var rThis = this;
        return json2tree(exp.getJson());

        function json2tree(json) {
            if (json == null) {
                return [];
            }

            if (!json) {
                return json;
            }

            if (typeof json == "string") { // Same as path object
                json = {
                    type: 'path',
                    path: json
                }
            }

            // Array
            if ($.isArray(json)) {
                return json.map(json2tree);
            }

            // Obj
            switch (json.type) {
                case 'constant':
                    return {
                        text: "" + json.value,
                        data: json,
                        type: 'constant',
                        children: false
                    };
                case 'path':
                    return {
                        text: json.path,
                        data: json,
                        type: 'path',
                        children: false
                    };
                case 'function':
                    var args = $.isArray(json.args) ? json.args : [json.args];
                    var data = $.extend({}, json, {args: json.args.length}); // Bind only number of args in the data

                    return {
                        text: rThis._buildFunctionNodeHtml(data.func, data.args),
                        data: data,
                        type: 'function',
                        children: json2tree(args),
                        state: {
                            opened: false
                        }
                    }
            }
        }
    },

    _tree2expression: function ($tree, nodeId) {

        nodeId = nodeId || '#';
        nodeId = nodeId.hasOwnProperty('id') ? nodeId.id : nodeId;

        var tree = $tree.jstree(true);

        return new Expression(node2json(tree.get_node(nodeId)));

        //

        function node2json(node) {

            if (node.id == '#') { // Root level
                var rootData = node.children.map(function (childId) {
                    return node2json(tree.get_node(childId));
                }).filter(function (c) {
                    return c != null;
                });
                return !rootData.length
                    ? null           // Empty
                    : rootData.length == 1
                        ? rootData[0]
                        : rootData; // Return single element
            }

            if (node.type == 'default') { // Just default folder with values
                return node.children.map(function (childId) {
                    return node2json(tree.get_node(childId));
                }).filter(function (c) {
                    return c != null;
                });
            }

            if (node.data.type == 'function') {
                return $.extend(
                    true,
                    {},
                    node.data,
                    {
                        args: node.children.map(function (childId) {
                            return node2json(tree.get_node(childId));
                        }).filter(function (c) {
                            return c != null;
                        })
                    }
                );
            }

            if (node.data.type == 'constant') {
                if ((typeof node.data.value === 'string') && !node.data.value.length) return null; // Ignore empty constants
            }

            // All other types
            return $.extend(true, {}, node.data);
        }
    },

    _getExpression: function (nodeId) {
        return this._tree2expression(this.$tree, nodeId);
    },

    _getAllChildrenNodes: function (parentId, dfs) {

        dfs = dfs || false; // DFS or BFS
        parentId = parentId || '#';

        var rThis = this;
        var $tree = this.$tree;
        var parent = $tree.jstree('get_node', parentId);

        if (!parent.children) return [];

        var children = [];
        if (dfs) {
            parent.children.forEach(function (cId) {    // DFS mode
                children.push($tree.jstree('get_node', cId));
                children.push.apply(children, rThis._getAllChildrenNodes(cId, dfs));
            });
        } else {
            children = parent.children.map(function (cId) { // BFS mode
                return $tree.jstree('get_node', cId);
            });
            parent.children.forEach(function (cId) {
                children.push.apply(children, rThis._getAllChildrenNodes(cId, dfs))
            });
        }

        return children;
    },

    _clear: function () {
        var $tree = this.$tree;
        var root = $tree.jstree('get_node', '#');
        root.children.map(function (c) {
            return c;
        }).forEach(function (c) {
            $tree.jstree('delete_node', c);
        });
    },

    _addNode: function (nodeJson, parentId, inline) {
        var $tree = this.$tree;
        parentId = $tree.jstree('get_node', parentId || '#'); // Add to root by default
        inline = inline || false; // Whether to insert after or add inside (default)
        var newNodeIds = [];
        ($.isArray(nodeJson) ? nodeJson : [nodeJson]).forEach(function (node) {
            newNodeIds.push($tree.jstree(true).create_node(parentId, node, inline ? 'after' : 'last'));
        });
        return newNodeIds.length == 1 ? newNodeIds[0] : newNodeIds;
    },

    _moveNodes: function (nodeIds, newParentId, inline) {
        newParentId = this.$tree.jstree('get_node', newParentId || '#'); // Move to root by default
        inline = inline || false; // Whether to move after or inside (default)
        this.$tree.jstree(true).move_node(nodeIds, newParentId, inline ? 'after' : 'last');
    },

    // Public methods
    getErrors: function () {

        var $tree = this.$tree;
        var functionSpecs = this.state.functionSpecs;

        if (!functionSpecs || !Object.keys(functionSpecs).length) return null; // Can't validate

        var errors = [];

        this._getAllChildrenNodes()
            .filter(function (n) {
                return n.type == 'function';
            })
            .forEach(function (func) {
                var name = func.data.func;
                if (!functionSpecs.hasOwnProperty(name)) {
                    errors.push('Unrecognised function: ' + name + '()');
                } else {
                    var spec = functionSpecs[name];
                    var mandatoryArgs = spec.args.filter(function (arg) {
                        return arg.mandatory;
                    }).length;
                    var hasMultiple = spec.args.some(function (arg) {
                        return arg.multiple;
                    });
                    if (func.children.length < mandatoryArgs) {
                        errors.push(name + '() is missing ' + (mandatoryArgs - func.children.length) + ' mandatory arguments');
                    }
                    if (func.children.length > spec.args.length && !hasMultiple) {
                        errors.push(name + '() has too many arguments (should be max ' + spec.args.length + ')');
                    }
                    for (var i = 0, len = func.children.length; i < len; i++) {

                        var child = $tree.jstree('get_node', func.children[i]);
                        var argType = spec.args[Math.min(i, spec.args.length - 1)].type;
                        if (i >= spec.args.length && !hasMultiple && child.data) {
                            argType = child.data.type
                        }

                        if (
                            (argType == 'timeSeries' && child.data && child.data.type == 'constant') ||
                            (
                                (argType == 'number' || argType == 'string') &&
                                (
                                    (child.data.type != 'constant') ||
                                    (argType == 'number' && isNaN(child.data.value))
                                )
                            )
                        ) {
                            errors.push(name + "'s argument " + (i + 1) + " should be of type " + argType);
                        }
                    }
                }
            });

        return errors;
    },

    getSelected: function (dfs) {
        return this._getAllChildrenNodes('#', dfs)
            .filter(function (n) {
                return n.state.selected;
            });
    },

    addExpression: function (exp, parentId, inline) {
        return this._addNode(this._expression2tree(exp), parentId, inline);
    },

    addFunction: function (parentId, inline, callback) {
        parentId = parentId || '#';
        parentId = parentId.hasOwnProperty('id') ? parentId.id : parentId;

        var rThis = this;
        var $anchor = $('<span>');
        var rModal = React.render(
            <Dialog
                title="Choose a function"
                onClose={function () {
                    // GC rogue modal
                    React.unmountComponentAtNode($anchor[0]);
                }}
            >
                <FunctionBrowser
                    functionSpecs={this.state.functionSpecs}
                    onFunctionSelected={
                        function (func) {
                            rModal.close();
                            var newNode = rThis.addExpression(
                                new Expression({
                                    type: "function",
                                    func: func,
                                    args: []
                                }),
                                parentId,
                                inline
                            );
                            if (callback) callback(newNode);
                        }
                    }
                />
            </Dialog>,
            $anchor[0]
        );
    },

    addMetric: function (parentId, inline, callback) {
        parentId = parentId || '#';
        parentId = parentId.hasOwnProperty('id') ? parentId.id : parentId;

        var rThis = this;
        var $anchor = $('<span>');
        var rModal = React.render(
            <Dialog
                title="Choose a metric"
                onClose={function () {
                    // GC rogue modal
                    React.unmountComponentAtNode($anchor[0]);
                }}
            >
                <MetricExplorer
                    onLeafSelected={
                        function (id) {
                            rModal.close();
                            var newNode = rThis.addExpression(
                                new Expression({
                                    type: "path",
                                    path: id
                                }),
                                parentId,
                                inline
                            );
                            if (callback) callback(newNode);
                        }
                    }
                />
            </Dialog>,
            $anchor[0]
        );
    },

    addConstant: function (parentId, inline) {
        parentId = parentId || '#';
        parentId = parentId.hasOwnProperty('id') ? parentId.id : parentId;

        var nodeId = this.addExpression(new Expression({
                type: "constant",
                value: ''
            }),
            parentId,
            inline
        );
        this.editNode(nodeId);
    },

    wrapInFunction: function (nodeId, callback) {
        // Also accepts multiple nodes as an array

        var rThis = this;
        var $tree = this.$tree;
        var nodesToMove = nodeId ? (Array.isArray(nodeId) ? nodeId : [nodeId]) : [];
        nodesToMove = nodesToMove.map(function (n) {
            return n.hasOwnProperty('id') ? n.id : n;
        });

        var rootLevel = !nodesToMove.length; // Wrap root nodes in function
        if (rootLevel) nodesToMove.push($tree.jstree(true).get_node('#').children);
        var nodeToMoveTo = rootLevel ? '#' : nodesToMove[0];

        this.addFunction(nodeToMoveTo, !rootLevel, function (funcId) {
            rThis._moveNodes(nodesToMove, funcId);
            $tree.jstree(true).open_node(funcId);
            if (callback) callback(funcId);
        });
    },

    popOut: function (nodeId) {
        var nodes = nodeId ? (Array.isArray(nodeId) ? nodeId : [nodeId]) : [];
        var nodeIds = nodes.map(function (n) {
            return n.hasOwnProperty('id') ? n.id : n;
        });
        var $tree = this.$tree;
        nodeIds.forEach(function (n) {
            var parentId = $tree.jstree('get_node', n).parent;
            if (parentId == '#') return; // Already at top level
            $tree.jstree(true).move_node(n, parentId, 'before');
        });
    },

    editNode: function (nodeId) {
        nodeId = nodeId.hasOwnProperty('id') ? nodeId.id : nodeId;

        var rThis = this;
        var tree = this.$tree.jstree(true);
        var $node = tree.get_node(nodeId);
        switch ($node.type) {
            case "function":
                var $anchor = $('<span>');
                var rModal = React.render(
                    <Dialog
                        title={'Change function: ' + $node.data.func}
                        onClose={function () {
                            // GC rogue modal
                            React.unmountComponentAtNode($anchor[0]);
                        }}
                    >
                        <FunctionBrowser
                            functionSpecs={this.state.functionSpecs}
                            initHighlight={$node.data.func}
                            onFunctionSelected={
                                function (func) {
                                    rModal.close();
                                    tree.rename_node($node, rThis._buildFunctionNodeHtml(func, $node.data.args));
                                    $node.data.func = func;
                                }
                            }
                        />
                    </Dialog>,
                    $anchor[0]
                );

                break;
            case "path":
                var $anchor = $('<span>');
                var rModal = React.render(
                    <Dialog
                        title={'Edit metric: ' + $node.text}
                        onClose={function () {
                            // GC rogue modal
                            React.unmountComponentAtNode($anchor[0]);
                        }}
                    >
                        <MetricExplorer
                            initExpandPath={$node.data.path}
                            onLeafSelected={
                                function (id) {
                                    rModal.close();
                                    tree.rename_node($node, id);
                                    $node.data = new Expression({
                                        type: "path",
                                        path: id
                                    }).getJson();
                                }
                            }
                        />
                    </Dialog>,
                    $anchor[0]
                );

                break;
            case "constant":
                // Is it already being edited?
                if (!$('#' + nodeId, this.$tree).find('input').length) {
                    tree.edit(nodeId);
                }
                break;
        }
    },

    cloneNode: function (nodeId) {
        // Also accepts multiple nodes as an array
        var nodes = Array.isArray(nodeId) ? nodeId : [nodeId];
        var nodeToAppendAfter = nodes[nodes.length - 1]; // Last node in selection
        nodeToAppendAfter = nodeToAppendAfter.hasOwnProperty('id') ? nodeToAppendAfter.id : nodeToAppendAfter;

        var rThis = this;
        var $tree = this.$tree;
        nodes.reverse().forEach(function (node) {
            nodeId = node.hasOwnProperty('id') ? node.id : node;
            rThis.addExpression(
                rThis._tree2expression($tree, nodeId),
                nodeToAppendAfter,
                true
            );
        });
    },

    removeNode: function (nodeId) {
        // Accepts multiple nodes as an array too
        var nodes = Array.isArray(nodeId) ? nodeId : [nodeId];
        nodes = nodes.map(function (n) {
            return n.hasOwnProperty('id') ? n.id : n;
        });
        this.$tree.jstree(true).delete_node(nodes);
    }

});

export default ExpressionTree;
