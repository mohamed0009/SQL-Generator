package com.example.sqlgenerator.service;

import com.example.sqlgenerator.model.TableDefinition;
import com.example.sqlgenerator.model.ColumnDefinition;
import com.example.sqlgenerator.model.IndexDefinition;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SQLGeneratorService {

    public String generateCreateTableSQL(TableDefinition table) {
        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE ").append(table.getTableName()).append(" (\n");

        // Generate column definitions
        for (int i = 0; i < table.getColumns().size(); i++) {
            var column = table.getColumns().get(i);
            sql.append("    ").append(column.getName())
                    .append(" ").append(column.getDataType());

            if (!column.isNullable()) {
                sql.append(" NOT NULL");
            }

            if (column.isPrimaryKey()) {
                sql.append(" PRIMARY KEY");
            }

            if (column.isUnique()) {
                sql.append(" UNIQUE");
            }

            if (column.getDefaultValue() != null) {
                sql.append(" DEFAULT ").append(column.getDefaultValue());
            }

            if (i < table.getColumns().size() - 1) {
                sql.append(",");
            }
            sql.append("\n");
        }

        // Add foreign key constraints
        if (table.getForeignKeys() != null && !table.getForeignKeys().isEmpty()) {
            sql.append(",\n");
            for (var fk : table.getForeignKeys()) {
                sql.append("    FOREIGN KEY (").append(fk.getColumnName())
                        .append(") REFERENCES ").append(fk.getReferenceTable())
                        .append("(").append(fk.getReferenceColumn()).append("),\n");
            }
            sql.setLength(sql.length() - 2); // Remove last comma
        }

        sql.append("\n);");

        // Generate indexes
        if (table.getIndexes() != null) {
            for (var index : table.getIndexes()) {
                sql.append("\n\nCREATE ");
                if (index.isUnique()) {
                    sql.append("UNIQUE ");
                }
                sql.append("INDEX ").append(index.getIndexName())
                        .append(" ON ").append(table.getTableName())
                        .append("(").append(String.join(", ", index.getColumnNames()))
                        .append(");");
            }
        }

        return sql.toString();
    }

    public String generateAlterTableSQL(String tableName, List<ColumnDefinition> columnsToAdd) {
        StringBuilder sql = new StringBuilder();
        sql.append("ALTER TABLE ").append(tableName).append("\n");

        for (int i = 0; i < columnsToAdd.size(); i++) {
            var column = columnsToAdd.get(i);
            sql.append("ADD COLUMN ").append(column.getName())
                    .append(" ").append(column.getDataType());

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