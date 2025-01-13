/*
  # Create Route Management Tables

  1. New Tables
    - `route_stretches`
      - `id` (uuid, primary key)
      - `name` (text)
      - `status` (enum: not_started, in_progress, completed)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
    
    - `waypoints`
      - `id` (uuid, primary key)
      - `stretch_id` (uuid, references route_stretches)
      - `latitude` (float)
      - `longitude` (float)
      - `sequence` (integer)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own routes
    - Add policies for authenticated users to manage waypoints of their routes
*/

-- Create enum for route status
CREATE TYPE route_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Create route_stretches table
CREATE TABLE IF NOT EXISTS route_stretches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status route_status NOT NULL DEFAULT 'not_started',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create waypoints table
CREATE TABLE IF NOT EXISTS waypoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stretch_id uuid REFERENCES route_stretches(id) ON DELETE CASCADE,
  latitude float NOT NULL,
  longitude float NOT NULL,
  sequence integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE route_stretches ENABLE ROW LEVEL SECURITY;
ALTER TABLE waypoints ENABLE ROW LEVEL SECURITY;

-- Policies for route_stretches
CREATE POLICY "Users can view their own routes"
  ON route_stretches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own routes"
  ON route_stretches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routes"
  ON route_stretches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routes"
  ON route_stretches
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for waypoints
CREATE POLICY "Users can view waypoints of their routes"
  ON waypoints
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM route_stretches
      WHERE id = waypoints.stretch_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create waypoints for their routes"
  ON waypoints
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM route_stretches
      WHERE id = waypoints.stretch_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update waypoints of their routes"
  ON waypoints
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM route_stretches
      WHERE id = waypoints.stretch_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM route_stretches
      WHERE id = waypoints.stretch_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete waypoints of their routes"
  ON waypoints
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM route_stretches
      WHERE id = waypoints.stretch_id
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS route_stretches_user_id_idx ON route_stretches(user_id);
CREATE INDEX IF NOT EXISTS waypoints_stretch_id_idx ON waypoints(stretch_id);
CREATE INDEX IF NOT EXISTS waypoints_sequence_idx ON waypoints(stretch_id, sequence);