package com.example.sqlgenerator.model;

import lombok.Data;
import java.util.List;

@Data
public class IndexDefinition {
    private String indexName;
    private List<String> columnNames;
    private boolean isUnique;
}