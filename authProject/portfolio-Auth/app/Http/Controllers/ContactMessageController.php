<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;

class ContactMessageController extends Controller
{
    public function store(ContactMessageRequest $request): RedirectResponse
    {
        ContactMessage::create($request->validated());

        return to_route('home')->with('success', 'Thanks for reaching out! I will reply soon.');
    }
}
