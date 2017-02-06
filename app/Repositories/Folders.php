<?php

namespace App\Repositories;

use App\File;
use App\Folder;
use Illuminate\Support\Facades\DB;

class Folders{
  public function pathContent($path){
    if($path == "/"){
      $folders = Folder::whereNull('folder_id')->get();
      $files = File::whereNull('folder_id')->get();
      return compact('folders', 'files');
    }
    $id = $this->pathId($path);
    if($id>0){
      return Folder::with(['folders','files'])->find();
    }else{
      return []; // should raise error
    }

  }
  public function pathId($path){
    if($path == "/"){
      return null;
    }
    if(starts_with($path,'/')){
      $path = substr($path,1);
    }
    $folders = explode("/",$path);
    $size = sizeof($folders);
    $query = DB::table('folders AS f1');


    for($i=1; $i < $size; $i++){
      $query->join('folders AS f'.($i+1), function($join) use ($i, $folders){
        $join->on('f'.($i).'.id','=','f'.($i+1).'.folder_id');
        $join->where('f'.($i+1).'.name','=', $folders[$i]);
      });
    }
    $result = $query->select('f'.($size).'.id')
      ->whereNull('f1.folder_id')
      ->where('f1.name','=',$folders[0])
      ->get();

    if(sizeof($result)>0){
      return $result[0]->id;
    }else{
      return -1;
    }
  }
}