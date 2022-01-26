<?php

namespace App\Http\Controllers;

use App\Models\SubtitleText;
use App\Models\SubtitleVideo;
use Illuminate\Http\Request;

class ExtensionApiController extends Controller
{
    private function langNameSearcher (string $langCode) {
        $language_list_json = file_get_contents(storage_path("app/public/language.json"));
        $lang_list_array = json_decode($language_list_json);

        foreach ($lang_list_array as $lang) {
            if ($lang->languageCode == $langCode) {
                return ($lang->languageName->simpleText);
            }
        }
    }

    public function preview(string $video_id) {
        /**
         * Get subtitle list from a video
         */
        $preview_list = SubtitleVideo::query()->where('video_id', $video_id)->firstOrFail();
        $subtitle_list = SubtitleText::query()->where('subtitle_video_id', $preview_list->id)->get();

        $result = array();
        foreach ($subtitle_list as $subtitle) {
            [
                'id' => $id,
                'lang' => $lang,
                'uploader' => $uploader,
            ] =  $subtitle;

            array_push($result, array(
                "baseUrl" => "extensionApi/subtitle/{$id}",
                "isTranslatable" => false,
                "languageCode" => "{$lang} ({$uploader})",
                "name" => array(
                    "simpleText" => "{$this->langNameSearcher($lang)} - {$uploader}"
                ),
                "vssId" => ".{$this->langNameSearcher($lang)} ({$uploader})"
            ));
        }

        return response()->json($result);
    }

    public function subtitle($subtitle_id) {
        /**
         * get specific subtitle from its id
         */
        $subtitle = SubtitleText::query()->where('id', $subtitle_id)->firstOrFail();
        [ 'filename' => $filename, 'format' => $format ] =  $subtitle;

        $subtitle_file_path = storage_path("app/public/subtitles/{$filename}.{$format}");
        return response()->file($subtitle_file_path);
    }
}
