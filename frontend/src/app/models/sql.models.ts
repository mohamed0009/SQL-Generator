export type SQLDialect = 'MySQL' | 'PostgreSQL' | 'SQLite' | 'SQL Server';
export type ExportFormat = 'SQL' | 'JSON' | 'TypeScript' | 'Java Entity';
export type RelationType = 'oneToOne' | 'oneToMany' | 'manyToMany';

export interface TableRelation {
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  relationType: RelationType;
}

export interface Table {
  name: string;
  columns: Column[];
  relations?: TableRelation[];
}

export interface Column {
  name: string;
  type: string;
  primaryKey: boolean;
  autoIncrement: boolean;
  required: boolean;
  unique: boolean;
  defaultValue?: string;
  reference?: string;
}

export interface SchemaVisualization {
  tables: TableNode[];
  relations: RelationEdge[];
  layout: 'force' | 'hierarchical' | 'circular';
}

export interface TableNode {
  id: string;
  name: string;
  columns: Column[];
  x?: number;
  y?: number;
}

export interface RelationEdge {
  id: string;
  source: string;
  target: string;
  type: RelationType;
}

export const columnTemplates = {
  id: {
    name: 'id',
    type: 'entier',
    primaryKey: true,
    autoIncrement: true,
    required: true,
    unique: true,
    defaultValue: undefined,
  },
  timestamp: {
    name: 'created_at',
    type: 'date',
    primaryKey: false,
    autoIncrement: false,
    required: true,
    unique: false,
    defaultValue: 'CURRENT_TIMESTAMP',
  },
  foreignKey: {
    name: 'foreign_id',
    type: 'entier',
    primaryKey: false,
    autoIncrement: false,
    required: true,
    unique: false,
    defaultValue: undefined,
  },
} as const;
