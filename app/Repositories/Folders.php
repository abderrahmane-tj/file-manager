<?php

namespace App\Repositories;

use App\File;
use App\Folder;
use Illuminate\Support\Facades\DB;

class Folders{
  public function get($id){
    if($id==null){
      return $this->rootContent();
    }
    return Folder::with(['folders','files'])->find($id);
  }
  public function pathContent($path){
    $root_content = $this->rootContent();
    if($path == "/"){
      return [$root_content];
    }
    $ids = $this->pathIds($path);

    if($ids==null){
      return []; // should raise error
    }else{
      $path_cotents = Folder::with(['folders','files'])->whereIn('id',$ids)
        ->orderByRaw(DB::raw("FIELD(id,".join(',',$ids).")"))
        ->get();
      $path_cotents->prepend($root_content);
      return $path_cotents;
    }

  }
  public function pathIds($path){
    if($path == "/"){
      return [];
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

    $selection = [];
    for($i=1;$i<=$size;$i++){
      $selection[$i-1] = 'f'.($i).'.id as '.$i;
    }
    $result = $query->select($selection)
      ->whereNull('f1.folder_id')
      ->where('f1.name','=',$folders[0])
      ->first();

    if(sizeof($result)>0){
      return collect($result)->values()->toArray();
    }else{
      return null;
    }
  }
  private function rootContent(){
    $folders = Folder::whereNull('folder_id')->get();
    $files = File::whereNull('folder_id')->get();
    $id = null;
    return compact('id','folders', 'files');
  }
}