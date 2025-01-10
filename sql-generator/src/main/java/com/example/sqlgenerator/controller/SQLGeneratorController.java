package com.example.sqlgenerator.controller;

import com.example.sqlgenerator.dto.TableDefinition;
import com.example.sqlgenerator.service.SQLGeneratorService;
import com.example.sqlgenerator.exception.SQLParseException;
import com.example.sqlgenerator.dto.ErrorResponse;
import com.example.sqlgenerator.dto.TableRequest;
import com.example.sqlgenerator.dto.ColumnRequest;
import com.example.sqlgenerator.model.ColumnDefinition;
import com.example.sqlgenerator.model.ForeignKeyDefinition;
import com.example.sqlgenerator.model.Table;
import com.example.sqlgenerator.model.Column;
import com.example.sqlgenerator.model.TableRelation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/sql")
@CrossOrigin(origins = "*")
public class SQLGeneratorController {

    @Autowired
    private SQLGeneratorService sqlGeneratorService;

    @PostMapping(value = "/generate/simple", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> generateSimpleSQL(@RequestBody TableRequest request) {
        try {
            if (request.getTables() == null || request.getTables().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: No tables provided");
            }

            StringBuilder fullSql = new StringBuilder();
            for (Table table : request.getTables()) {
                com.example.sqlgenerator.model.TableDefinition modelDef = convertTableToModel(table);
                String sql = sqlGeneratorService.generateCreateTableSQL(modelDef);
                fullSql.append(sql).append("\n\n");
            }

            return ResponseEntity.ok(fullSql.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateSQL(@RequestBody TableRequest request) {
        try {
            if (request.getTables() == null || request.getTables().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: No tables provided");
            }

            String dialect = request.getDialect() != null ? request.getDialect() : "MySQL";
            System.out.println("Generating SQL for dialect: " + dialect); // Debug log
            System.out.println("Tables: " + request.getTables()); // Debug log

            String sql = generateSQLBasedOnDialect(request.getTables(), dialect);
            return ResponseEntity.ok(sql);
        } catch (Exception e) {
            e.printStackTrace(); // Debug log
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    private String generateSQLBasedOnDialect(List<Table> tables, String dialect) {
        StringBuilder sql = new StringBuilder();

        for (Table table : tables) {
            switch (dialect) {
                case "MySQL":
                    sql.append(generateMySQLTable(table));
                    break;
                case "PostgreSQL":
                    sql.append(generatePostgreSQLTable(table));
                    break;
                case "SQLite":
                    sql.append(generateSQLiteTable(table));
                    break;
                case "SQL Server":
                    sql.append(generateSQLServerTable(table));
                    break;
                default:
                    sql.append(generateMySQLTable(table));
            }
            sql.append("\n\n");
        }

        for (Table table : tables) {
            if (table.getRelations() != null) {
                sql.append(generateRelations(table, dialect));
            }
        }

        return sql.toString();
    }

    private com.example.sqlgenerator.model.TableDefinition convertTableToModel(Table table) {
        com.example.sqlgenerator.model.TableDefinition definition = new com.example.sqlgenerator.model.TableDefinition();
        definition.setTableName(table.getName());

        List<ColumnDefinition> columns = new ArrayList<>();
        List<ForeignKeyDefinition> foreignKeys = new ArrayList<>();

        // Convert columns and detect foreign keys
        for (Column col : table.getColumns()) {
            ColumnDefinition column = new ColumnDefinition();
            column.setName(col.getName());
            column.setType(col.getType());
            column.setPrimaryKey(col.isPrimaryKey());
            column.setAutoIncrement(col.isAutoIncrement());
            column.setNullable(col.isNullable());
            column.setUnique(col.isUnique());
            column.setDefaultValue(col.getDefaultValue());
            columns.add(column);
        }

        definition.setColumns(columns);
        definition.setForeignKeys(foreignKeys);
        return definition;
    }

    private ColumnDefinition convertColumnRequest(ColumnRequest request) {
        ColumnDefinition column = new ColumnDefinition();
        column.setName(request.getName());
        column.setType(request.getType());
        column.setPrimaryKey(request.isPrimaryKey());
        column.setAutoIncrement(request.isAutoIncrement());
        column.setNullable(!request.isRequired());
        column.setUnique(request.isUnique());
        column.setDefaultValue(request.getDefaultValue());
        return column;
    }

    private String generateMySQLTable(Table table) {
        try {
            StringBuilder sql = new StringBuilder();
            sql.append("CREATE TABLE ").append(table.getName()).append(" (\n");

            // Add columns
            for (int i = 0; i < table.getColumns().size(); i++) {
                Column column = table.getColumns().get(i);
                sql.append("  ").append(generateColumnDefinition(column, "MySQL"));
                if (i < table.getColumns().size() - 1) {
                    sql.append(",");
                }
                sql.append("\n");
            }

            sql.append(");");
            return sql.toString();
        } catch (Exception e) {
            e.printStackTrace(); // Debug log
            throw e;
        }
    }

    private String generatePostgreSQLTable(Table table) {
        // Similar to MySQL but with PostgreSQL syntax
        return generateMySQLTable(table); // For now, using MySQL syntax
    }

    private String generateSQLiteTable(Table table) {
        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE ").append(table.getName()).append(" (\n");

        // Add columns
        for (int i = 0; i < table.getColumns().size(); i++) {
            Column column = table.getColumns().get(i);
            sql.append("  ").append(generateSQLiteColumnDefinition(column));
            if (i < table.getColumns().size() - 1) {
                sql.append(",");
            }
            sql.append("\n");
        }

        sql.append(");");
        return sql.toString();
    }

    private String generateSQLiteColumnDefinition(Column column) {
        StringBuilder def = new StringBuilder();
        def.append(column.getName()).append(" ");

        // SQLite specific data types
        switch (column.getType().toLowerCase()) {
            case "entier":
                def.append("INTEGER");
                break;
            case "texte":
                def.append("TEXT");
                break;
            case "date":
                def.append("DATETIME");
                break;
            default:
                def.append("TEXT");
        }

        // SQLite specific constraints
        if (column.isPrimaryKey()) {
            def.append(" PRIMARY KEY");
            if (column.isAutoIncrement()) {
                def.append(" AUTOINCREMENT");
            }
        }
        if (!column.isNullable()) {
            def.append(" NOT NULL");
        }
        if (column.isUnique()) {
            def.append(" UNIQUE");
        }
        if (column.getDefaultValue() != null && !column.getDefaultValue().isEmpty()) {
            def.append(" DEFAULT ").append(column.getDefaultValue());
        }

        return def.toString();
    }

    private String generateSQLServerTable(Table table) {
        // Similar to MySQL but with SQL Server syntax
        return generateMySQLTable(table); // For now, using MySQL syntax
    }

    private String generateRelations(Table table, String dialect) {
        if (table.getRelations() == null || table.getRelations().isEmpty()) {
            return "";
        }

        StringBuilder sql = new StringBuilder();
        for (TableRelation relation : table.getRelations()) {
            sql.append("ALTER TABLE ").append(relation.getSourceTable())
                    .append(" ADD CONSTRAINT fk_").append(relation.getSourceTable())
                    .append("_").append(relation.getTargetTable())
                    .append(" FOREIGN KEY (").append(relation.getSourceColumn())
                    .append(") REFERENCES ").append(relation.getTargetTable())
                    .append("(").append(relation.getTargetColumn()).append(");\n");
        }
        return sql.toString();
    }

    private String generateColumnDefinition(Column column, String dialect) {
        StringBuilder def = new StringBuilder();
        def.append(column.getName()).append(" ");

        // Add data type
        switch (dialect) {
            case "MySQL":
                def.append(getMySQLDataType(column));
                break;
            case "PostgreSQL":
                def.append(getPostgreSQLDataType(column));
                break;
            default:
                def.append(getMySQLDataType(column));
        }

        // Add constraints
        if (!column.isNullable()) {
            def.append(" NOT NULL");
        }
        if (column.isPrimaryKey()) {
            def.append(" PRIMARY KEY");
        }
        if (column.isAutoIncrement()) {
            def.append(" AUTO_INCREMENT");
        }
        if (column.isUnique()) {
            def.append(" UNIQUE");
        }
        if (column.getDefaultValue() != null && !column.getDefaultValue().isEmpty()) {
            def.append(" DEFAULT ").append(column.getDefaultValue());
        }

        return def.toString();
    }

    private String getMySQLDataType(Column column) {
        switch (column.getType().toLowerCase()) {
            case "entier":
                return "INT";
            case "texte":
                return "VARCHAR(255)";
            case "date":
                return "DATETIME";
            default:
                return "VARCHAR(255)";
        }
    }

    private String getPostgreSQLDataType(Column column) {
        switch (column.getType().toLowerCase()) {
            case "entier":
                return "INTEGER";
            case "texte":
                return "VARCHAR(255)";
            case "date":
                return "TIMESTAMP";
            default:
                return "VARCHAR(255)";
        }
    }
}