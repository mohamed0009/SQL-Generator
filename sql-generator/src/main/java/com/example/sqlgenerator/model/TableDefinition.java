package com.example.sqlgenerator.model;

import lombok.Data;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@Data
public class TableDefinition {
    @NotBlank(message = "Table name is required")
    private String tableName;

    @NotEmpty(message = "At least one column is required")
    private List<ColumnDefinition> columns;

    private List<ForeignKeyDefinition> foreignKeys;
    private List<IndexDefinition> indexes;
}