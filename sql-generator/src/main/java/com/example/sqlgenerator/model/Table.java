package com.example.sqlgenerator.model;

import java.util.List;

public class Table {
    private String name;
    private List<Column> columns;
    private List<TableRelation> relations;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }

    public List<TableRelation> getRelations() {
        return relations;
    }

    public void setRelations(List<TableRelation> relations) {
        this.relations = relations;
    }
}