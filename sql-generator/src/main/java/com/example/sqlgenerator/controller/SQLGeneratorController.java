package com.example.sqlgenerator.controller;

import com.example.sqlgenerator.dto.TableDefinition;
import com.example.sqlgenerator.service.SQLGeneratorService;
import com.example.sqlgenerator.exception.SQLParseException;
import com.example.sqlgenerator.dto.ErrorResponse;
import com.example.sqlgenerator.dto.TableRequest;
import com.example.sqlgenerator.dto.ColumnRequest;
import com.example.sqlgenerator.model.ColumnDefinition;
import com.example.sqlgenerator.model.ForeignKeyDefinition;
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
            if (request.getTables() == null || request.getTables().isEmpty() ||
                    request.getTables().get(0).getColumns() == null ||
                    request.getTables().get(0).getColumns().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Error: No tables or columns provided");
            }

            StringBuilder fullSql = new StringBuilder();
            for (TableDefinition table : request.getTables()) {
                com.example.sqlgenerator.model.TableDefinition modelDef = convertTableToModel(table);
                String sql = sqlGeneratorService.generateCreateTableSQL(modelDef);
                fullSql.append(sql).append("\n\n");
            }

            return ResponseEntity.ok(fullSql.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Error: " + e.getMessage());
        }
    }

    private com.example.sqlgenerator.model.TableDefinition convertTableToModel(TableDefinition table) {
        com.example.sqlgenerator.model.TableDefinition definition = new com.example.sqlgenerator.model.TableDefinition();
        definition.setTableName(table.getName());

        List<ColumnDefinition> columns = new ArrayList<>();
        List<ForeignKeyDefinition> foreignKeys = new ArrayList<>();

        // Convert columns and detect foreign keys
        for (ColumnRequest col : table.getColumns()) {
            ColumnDefinition column = convertColumnRequest(col);
            columns.add(column);

            // Handle foreign key reference
            if (col.getReference() != null) {
                String[] parts = col.getReference().split("\\.");
                if (parts.length == 2) {
                    ForeignKeyDefinition fk = new ForeignKeyDefinition();
                    fk.setColumnName(col.getName());
                    fk.setReferenceTable(parts[0]);
                    fk.setReferenceColumn(parts[1]);
                    foreignKeys.add(fk);
                }
            }
        }

        definition.setColumns(columns);
        definition.setForeignKeys(foreignKeys);
        return definition;
    }

    private ColumnDefinition convertColumnRequest(ColumnRequest request) {
        ColumnDefinition column = new ColumnDefinition();
        column.setName(request.getName());
        column.setDataType(request.getType());
        column.setPrimaryKey(request.isPrimaryKey());
        column.setAutoIncrement(request.isAutoIncrement());
        column.setNullable(!request.isRequired());
        column.setUnique(request.isUnique());
        column.setDefaultValue(request.getDefaultValue());
        return column;
    }
}