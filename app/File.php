<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
  protected $fillable = [
    'name', 'mimetype', 'filename', 'folder_id'
  ];

  public function parent(){
    return $this->belongsTo('App\Folder');
  }
}
