package com.example.sqlgenerator.dto;

import lombok.Data;
import java.util.List;
import com.example.sqlgenerator.model.IndexDefinition;

@Data
public class TableDefinition {
    private String name;
    private List<ColumnRequest> columns;
    private List<IndexDefinition> indexes;

    public List<IndexDefinition> getIndexes() {
        return indexes;
    }

    public void setIndexes(List<IndexDefinition> indexes) {
        this.indexes = indexes;
    }
}