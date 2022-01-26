<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubtitleTextsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subtitle_texts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("subtitle_video_id");
            $table->string("filename");
            $table->string("uploader");
            $table->string("format");
            $table->string("lang");

            $table->foreign("subtitle_video_id")->references("id")->on("subtitle_videos");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subtitle_texts');
    }
}
