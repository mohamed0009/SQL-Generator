package com.example.sqlgenerator.model;

import lombok.Data;

@Data
public class ForeignKeyDefinition {
    private String columnName;
    private String referenceTable;
    private String referenceColumn;
}