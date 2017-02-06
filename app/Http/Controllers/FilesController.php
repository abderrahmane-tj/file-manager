<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileRequest;
use App\Repositories\Folders;
use Illuminate\Http\Request;
use App\File;

class FilesController extends Controller{
  public function upload(FileRequest $request, Folders $folders){
    $path = $request->input('path');
    $folder_id = $folders->pathId($path);
    if($folder_id === -1){
      // todo: raise error here
    }

    $file = $request->file('item');
    $name = $file->getClientOriginalName();
    $mimetype = $file->getMimeType();
    $filename = $request->file('item')->store('items');

    $file = File::create(compact('name','filename','mimetype','folder_id'));

    return $file;
  }

}
