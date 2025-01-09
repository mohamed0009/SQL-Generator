package com.example.sqlgenerator.controller;

import com.example.sqlgenerator.model.TableDefinition;
import com.example.sqlgenerator.service.SQLGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sql")
@CrossOrigin(origins = "*")
public class SQLGeneratorController {

    @Autowired
    private SQLGeneratorService sqlGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateSQL(@RequestBody TableDefinition tableDefinition) {
        String sql = sqlGeneratorService.generateCreateTableSQL(tableDefinition);
        return ResponseEntity.ok(sql);
    }
}