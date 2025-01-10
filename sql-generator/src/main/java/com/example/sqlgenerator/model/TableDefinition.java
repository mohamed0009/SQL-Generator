package com.example.sqlgenerator.model;

import java.util.List;

public class TableDefinition {
    private String tableName;
    private List<ColumnDefinition> columns;
    private List<ForeignKeyDefinition> foreignKeys;
    private List<IndexDefinition> indexes;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        if (tableName == null || tableName.trim().isEmpty()) {
            throw new IllegalArgumentException("Table name cannot be null or empty");
        }
        this.tableName = tableName;
    }

    public List<ColumnDefinition> getColumns() {
        return columns;
    }

    public void setColumns(List<ColumnDefinition> columns) {
        this.columns = columns;
    }

    public List<ForeignKeyDefinition> getForeignKeys() {
        return foreignKeys;
    }

    public void setForeignKeys(List<ForeignKeyDefinition> foreignKeys) {
        this.foreignKeys = foreignKeys;
    }

    public List<IndexDefinition> getIndexes() {
        return indexes;
    }

    public void setIndexes(List<IndexDefinition> indexes) {
        this.indexes = indexes;
    }
}