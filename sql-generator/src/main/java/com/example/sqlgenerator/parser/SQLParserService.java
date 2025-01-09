package com.example.sqlgenerator.parser;

import org.springframework.stereotype.Service;
import java.io.StringReader;
import com.example.sqlgenerator.exception.SQLParseException;
import com.example.sqlgenerator.parser.generated.SQLParser;

@Service
public class SQLParserService {

    public void validateSQL(String sql) {
        try (StringReader reader = new StringReader(sql)) {
            SQLParser parser = new SQLParser(reader);
            parser.TableDefinition();
        } catch (Exception e) {
            throw new SQLParseException("SQL validation failed: " + e.getMessage(), e);
        }
    }
}