<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use LogicException;

class Folder extends Model
{
  protected $fillable = [
    'name', 'folder_id'
  ];
  public function parent(){
    return $this->belongsTo('App\Folder');
  }
  public function files(){
    return $this->hasMany('App\File');
  }
  public function folders(){
    return $this->hasMany('App\Folder');
  }
}
