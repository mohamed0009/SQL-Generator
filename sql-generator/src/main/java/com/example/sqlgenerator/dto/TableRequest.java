package com.example.sqlgenerator.dto;

import java.util.List;
import com.example.sqlgenerator.model.Table;

public class TableRequest {
    private List<Table> tables;
    private String dialect = "MySQL"; // Default value

    public List<Table> getTables() {
        return tables;
    }

    public void setTables(List<Table> tables) {
        this.tables = tables;
    }

    public String getDialect() {
        return dialect;
    }

    public void setDialect(String dialect) {
        this.dialect = dialect;
    }
}