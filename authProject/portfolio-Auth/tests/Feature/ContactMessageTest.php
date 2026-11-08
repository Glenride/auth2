<?php

use App\Models\ContactMessage;

it('stores a contact message and flashes success', function () {
    $response = $this->post(route('contact.store'), [
        'name' => "D'Vaughn House",
        'email' => 'dvaughn@gmail.com',
        'message' => 'Excited to connect about a new project.',
    ]);

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHas('success', 'Thanks for reaching out! I will reply soon.');

    $this->assertDatabaseHas('contact_messages', [
        'name' => "D'Vaughn House",
        'email' => 'dvaughn@gmail.com',
        'message' => 'Excited to connect about a new project.',
    ]);
});

it('validates contact form input', function () {
    $response = $this
        ->from(route('home'))
        ->post(route('contact.store'), [
            'name' => '',
            'email' => 'not-an-email',
            'message' => '',
        ]);

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHasErrors([
            'name',
            'email',
            'message',
        ]);

    expect(ContactMessage::query()->count())->toBe(0);
});
