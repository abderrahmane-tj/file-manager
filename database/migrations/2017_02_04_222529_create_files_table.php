<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('files', function (Blueprint $table) {
      $table->increments('id');
      $table->string('name');
      $table->unsignedInteger('p_id');
      $table->timestamps();

      $table->unique(['p_id','name']);
      $table->foreign('p_id')->references('id')->on('files');
    });

    Schema::table('files',function(Blueprint $table){
//          $table->foreign('p_id')->references('id')->on('files');
    });

  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('files');
  }
}
