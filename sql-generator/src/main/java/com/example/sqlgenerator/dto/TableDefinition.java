package com.example.sqlgenerator.dto;

import lombok.Data;
import java.util.List;

@Data
public class TableDefinition {
    private String name;
    private List<ColumnRequest> columns;
}