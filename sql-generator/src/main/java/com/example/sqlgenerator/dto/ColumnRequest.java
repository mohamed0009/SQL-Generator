package com.example.sqlgenerator.dto;

import lombok.Data;

@Data
public class ColumnRequest {
    private String name;
    private String type; // "entier", "texte", "date"
    private boolean primaryKey;
    private boolean autoIncrement;
    private boolean required;
    private boolean unique;
    private String defaultValue;
    private String reference; // "table.column" format
}