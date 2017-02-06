<?php

namespace App\Http\Controllers;

use App\Repositories\Folders;
use Illuminate\Http\Request;

class FoldersController extends Controller
{
  public function contents(Folders $folders, $path="/"){
    return $folders->pathContent($path);
  }
}