package com.example.sqlgenerator.model;

import lombok.Data;

@Data
public class ColumnDefinition {
    private String name;
    private String dataType;
    private boolean isPrimaryKey;
    private boolean isNullable;
    private boolean isUnique;
    private boolean isAutoIncrement;
    private String defaultValue;
    private String reference; // For foreign key references
}