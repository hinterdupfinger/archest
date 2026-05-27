package com.example.controllers;

import com.example.repositories.UserRepository;

public class UserController {
    private final UserRepository repository = new UserRepository();

    public void handleRequest() {
        repository.save();
    }
}
