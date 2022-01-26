<?php

use App\Http\Controllers\ExtensionApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

header('Access-Control-Allow-Origin: https://www.youtube.com');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization, x-youtube-device, x-youtube-page-label, x-youtube-device, x-youtube-page-cl, x-youtube-utc-offset, x-youtube-client-name, x-youtube-client-version, x-youtube-ad-signals, x-youtube-identity-token, x-youtube-time-zone');
header('Access-Control-Allow-Credentials: true');

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get("/preview/{video_id}", [ExtensionApiController::class, 'preview']);
Route::get("/subtitle/{subtitle_id}", [ExtensionApiController::class, 'subtitle']);
