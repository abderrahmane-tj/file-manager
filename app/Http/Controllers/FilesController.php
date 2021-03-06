<?php

namespace App\Http\Controllers;

use App\Folder;
use App\Http\Requests\FileRequest;
use App\Repositories\Folders;
use Illuminate\Http\Request;
use App\File;

class FilesController extends Controller{
  public function upload(Request $request, Folders $folders){
    $id = $request->input('id');

    $folder_id = is_null($id) ? null : Folder::findOrFail($id)->id;
    $uploadedFiles = [];
    foreach($request->file("files") as $file) {
      $name = $file->getClientOriginalName();
      $mimetype = $file->getMimeType();
      $filename = $file->store('items');
      $uploaded = File::create(compact('name','filename','mimetype','folder_id'));
      array_push($uploadedFiles,$uploaded);
    }

    return $uploadedFiles;
  }

  public function details($path, Folders $folders){
    $parts = explode("/",$path);
    return $parts;
  }

}
