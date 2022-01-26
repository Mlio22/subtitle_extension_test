<?php

namespace Database\Seeders;

use App\Models\SubtitleText;
use App\Models\SubtitleVideo;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SubtitleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("subtitle_texts")->delete();
        DB::table("subtitle_videos")->delete();

        $subtitles_json = file_get_contents(storage_path("app/public/db.json"));
        $subtitle_list = json_decode($subtitles_json, false);

        foreach ($subtitle_list as $videoId => $value) {
            $subtitle_video = new SubtitleVideo([
                "video_id" => $videoId,
                "video_name" => $value->name
            ]);

            $subtitle_video->save();

            foreach($value as $lang => $subtitle_detail) {
                if($lang != "name") {
                    SubtitleText::create([
                        "subtitle_video_id" => $subtitle_video->id,
                        "filename" => $subtitle_detail[0]->filename,
                        "uploader" => $subtitle_detail[0]->creator,
                        "lang" => $lang,
                        "format" => "ytt"
                    ]);
                }
            }
        }

    }
}
