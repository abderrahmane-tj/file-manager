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
      $table->string('filename');
      $table->string('mimetype');

      $table->unsignedInteger('folder_id')->nullable();
      $table->timestamps();

//      $table->unique(['folder_id','name']);
      $table->foreign('folder_id')->references('id')->on('folders');
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
