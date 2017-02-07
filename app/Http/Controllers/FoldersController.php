<?php

namespace App\Http\Controllers;

use App\Http\Requests\FoldersRequest;
use App\Repositories\Folders;
use Illuminate\Http\Request;

class FoldersController extends Controller
{
  public function contents(Folders $folders, $id=null){
    return $folders->get($id);
  }
  public function contentsFromPath(Folders $folders, $path="/"){
    return $folders->pathContent($path);
  }
  public function store(Request $request, Folders $folders){
    $id = $request->input('id');
    $name = $request->input('name');
    return $folders->createFolder($id, $name);
  }
}
