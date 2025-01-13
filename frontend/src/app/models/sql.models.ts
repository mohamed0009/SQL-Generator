export type SQLDialect = 'MySQL' | 'PostgreSQL' | 'SQLite' | 'SQL Server';
export type ExportFormat = 'SQL' | 'TypeScript' | 'Java Entity' | 'JSON';
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
  primaryKey?: boolean;
  autoIncrement?: boolean;
  required?: boolean;
  unique?: boolean;
  reference?: string | null;
  defaultValue?: string | null;
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

export interface ColumnTemplate {
  name: string;
  type: string;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  required?: boolean;
  unique?: boolean;
  defaultValue?: string;
}

export const columnTemplates: Record<string, ColumnTemplate> = {
  id: {
    name: 'id',
    type: 'entier',
    primaryKey: true,
    autoIncrement: true,
    required: true,
    unique: true,
  },
  timestamp: {
    name: 'created_at',
    type: 'date',
    required: true,
    defaultValue: 'maintenant',
    primaryKey: false,
    autoIncrement: false,
    unique: false,
  },
  foreignKey: {
    name: 'reference_id',
    type: 'entier',
    required: true,
    primaryKey: false,
    autoIncrement: false,
    unique: false,
  },
};
