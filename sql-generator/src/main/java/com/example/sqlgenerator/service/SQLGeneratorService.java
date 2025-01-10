package com.example.sqlgenerator.service;

import com.example.sqlgenerator.model.TableDefinition;
import com.example.sqlgenerator.model.ColumnDefinition;
import com.example.sqlgenerator.model.IndexDefinition;
import com.example.sqlgenerator.model.ForeignKeyDefinition;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;

@Service
public class SQLGeneratorService {

    public String generateCreateTableSQL(TableDefinition table) {
        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE ").append(table.getTableName()).append(" (\n");

        List<String> columnDefs = new ArrayList<>();

        // Add regular columns
        for (ColumnDefinition column : table.getColumns()) {
            StringBuilder columnDef = new StringBuilder();
            columnDef.append("    ").append(column.getName()).append(" ");

            // Handle data type
            switch (column.getType().toLowerCase()) {
                case "entier":
                    columnDef.append("INT");
                    break;
                case "texte":
                    columnDef.append("VARCHAR(255)");
                    break;
                case "date":
                    columnDef.append("DATE");
                    break;
                default:
                    columnDef.append(column.getType());
            }

            // Handle primary key with auto increment
            if (column.isPrimaryKey() && column.isAutoIncrement()) {
                columnDef.append(" AUTO_INCREMENT PRIMARY KEY");
            } else {
                // Not null constraint
                if (!column.isNullable()) {
                    columnDef.append(" NOT NULL");
                }

                // Unique constraint
                if (column.isUnique()) {
                    columnDef.append(" UNIQUE");
                }
            }

            // Default value for dates
            if (column.getDefaultValue() != null &&
                    column.getType().toLowerCase().equals("date")) {
                columnDef.append(" DEFAULT CURRENT_TIMESTAMP");
            }

            columnDefs.add(columnDef.toString());
        }

        // Add foreign key constraints at the end
        if (table.getForeignKeys() != null) {
            for (ForeignKeyDefinition fk : table.getForeignKeys()) {
                columnDefs.add(String.format("    FOREIGN KEY (%s) REFERENCES %s(%s)",
                        fk.getColumnName(),
                        fk.getReferenceTable(),
                        fk.getReferenceColumn()));
            }
        }

        sql.append(String.join(",\n", columnDefs));
        sql.append("\n);\n");

        return sql.toString();
    }

    public String generateAlterTableSQL(String tableName, List<ColumnDefinition> columnsToAdd) {
        StringBuilder sql = new StringBuilder();
        sql.append("ALTER TABLE ").append(tableName).append("\n");

        for (int i = 0; i < columnsToAdd.size(); i++) {
            var column = columnsToAdd.get(i);
            sql.append("ADD COLUMN ").append(column.getName())
                    .append(" ").append(column.getType());

            if (!column.isNullable()) {
                sql.append(" NOT NULL");
            }

            if (column.isUnique()) {
                sql.append(" UNIQUE");
            }

            if (column.getDefaultValue() != null) {
                sql.append(" DEFAULT ").append(column.getDefaultValue());
            }

            if (i < columnsToAdd.size() - 1) {
                sql.append(",\n");
            }
        }
        sql.append(";");
        return sql.toString();
    }

    public String generateDropTableSQL(String tableName) {
        return "DROP TABLE IF EXISTS " + tableName + ";";
    }

    public String generateCreateIndexSQL(String tableName, IndexDefinition index) {
        StringBuilder sql = new StringBuilder();
        sql.append("CREATE ");
        if (index.isUnique()) {
            sql.append("UNIQUE ");
        }
        sql.append("INDEX ").append(index.getIndexName())
                .append(" ON ").append(tableName)
                .append("(").append(String.join(", ", index.getColumnNames()))
                .append(");");
        return sql.toString();
    }
}