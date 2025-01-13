/*
  # Add sequence column to route_stretches table

  1. Changes
    - Add sequence column to route_stretches table
    - Add default value and not null constraint
    - Update existing records to have sequential values
*/

-- Add sequence column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'route_stretches' AND column_name = 'sequence'
  ) THEN
    ALTER TABLE route_stretches ADD COLUMN sequence integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update existing records to have sequential values
WITH numbered_routes AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_sequence
  FROM route_stretches
)
UPDATE route_stretches
SET sequence = numbered_routes.new_sequence
FROM numbered_routes
WHERE route_stretches.id = numbered_routes.id;

-- Add index for better performance when ordering
CREATE INDEX IF NOT EXISTS route_stretches_sequence_idx ON route_stretches(sequence);