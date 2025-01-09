package com.example.sqlgenerator.dto;

import lombok.Data;
import java.util.List;

@Data
public class TableRequest {
    private List<TableDefinition> tables;
}