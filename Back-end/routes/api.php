<?php

use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\AdminEventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\EventController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1']);

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1']);

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/admin/events', [AdminEventController::class, 'create']);
    Route::put('/admin/events/{event}', [AdminEventController::class, 'update']);
    Route::delete('/admin/events/{event}', [AdminEventController::class, 'delete']);
    Route::get('/admin/events/{event}/bookings', [AdminBookingController::class, 'getEventBookings']);
});

Route::group([], function () {
    Route::get('/events/categories', [EventController::class, 'getCategories']);
    Route::get('/events/search', [EventController::class, 'search']);
    Route::get('/events/filter/date', [EventController::class, 'filterByDate']);
    Route::get('/events/filter/location', [EventController::class, 'filterByLocation']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::get('/events', [EventController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
    Route::post('/events/{event}/bookings', [BookingController::class, 'createBooking']);
    Route::put('/events/bookings/{booking}', [BookingController::class, 'updateBooking']);
    Route::delete('/events/bookings/{booking}', [BookingController::class, 'deleteBooking']);
    Route::get('/user/bookings', [BookingController::class, 'getUserBookings']);
    Route::get('/events/{event}/bookings/check', [BookingController::class, 'checkUserBookedEvent']);
});