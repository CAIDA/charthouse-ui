<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CharthouseController extends AbstractController
{
    /**
     * @Route("/", methods={"GET"}, name="explorer")
     *
     * @return Response
     */
    public function explorerUi(): Response
    {
        return $this->render(
            'explorer.html.twig'
        );
    }
}
