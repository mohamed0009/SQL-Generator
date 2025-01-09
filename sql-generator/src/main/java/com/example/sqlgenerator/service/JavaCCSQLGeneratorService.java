package com.example.sqlgenerator.service;

import com.example.sqlgenerator.model.TableDefinition;
import com.example.sqlgenerator.parser.SQLParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JavaCCSQLGeneratorService {

    @Autowired
    private SQLParserService sqlParserService;

    @Autowired
    private SQLGeneratorService sqlGeneratorService;

    public String generateSQL(TableDefinition tableDefinition) {
        StringBuilder sql = new StringBuilder();

        // Generate CREATE TABLE statement
        sql.append(sqlGeneratorService.generateCreateTableSQL(tableDefinition));

        // Generate indexes if any
        if (tableDefinition.getIndexes() != null && !tableDefinition.getIndexes().isEmpty()) {
            sql.append("\n\n");
            tableDefinition.getIndexes().forEach(index -> {
                sql.append(sqlGeneratorService.generateCreateIndexSQL(
                        tableDefinition.getTableName(), index));
                sql.append("\n");
            });
        }

        String finalSQL = sql.toString();

        // Validate the generated SQL using JavaCC parser
        try {
            sqlParserService.validateSQL(finalSQL);
            return finalSQL;
        } catch (Exception e) {
            throw new RuntimeException("Invalid SQL generated: " + e.getMessage());
        }
    }
}