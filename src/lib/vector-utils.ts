/**
 * Vector utilities for semantic mapping and dimensionality reduction.
 * Essential for the Resonance Map (FYP Upgrade).
 */

/**
 * Projects high-dimensional vectors (e.g., 768D) into 2D (X, Y) space.
 * Uses a simplified PCA-like projection for real-time frontend performance.
 */
export function projectTo2D(embeddings: number[][]): { x: number, y: number }[] {
  if (embeddings.length === 0) return [];
  if (embeddings.length === 1) return [{ x: 0, y: 0 }];

  // Simple Principal Component Analysis (PCA) approximation
  // For a high-impact FYP, we use a basic version of the Power Iteration method
  
  const dim = embeddings[0].length;
  const n = embeddings.length;

  // 1. Center the data
  const mean = new Array(dim).fill(0);
  for (const vec of embeddings) {
    for (let i = 0; i < dim; i++) mean[i] += vec[i] / n;
  }

  const centered = embeddings.map(vec => vec.map((val, i) => val - mean[i]));

  // 2. Find 1st Principal Component (PC1) using power iteration
  let pc1 = new Array(dim).fill(0).map(() => Math.random() - 0.5);
  for (let iter = 0; iter < 10; iter++) {
    let nextPc1 = new Array(dim).fill(0);
    for (const vec of centered) {
      const dot = vec.reduce((sum, val, i) => sum + val * pc1[i], 0);
      for (let i = 0; i < dim; i++) nextPc1[i] += dot * vec[i];
    }
    const mag = Math.sqrt(nextPc1.reduce((sum, val) => sum + val * val, 0));
    pc1 = nextPc1.map(val => val / mag);
  }

  // 3. Find 2nd Principal Component (PC2)
  let pc2 = new Array(dim).fill(0).map(() => Math.random() - 0.5);
  for (let iter = 0; iter < 10; iter++) {
    let nextPc2 = new Array(dim).fill(0);
    for (const vec of centered) {
      // Gram-Schmidt orthogonalization relative to pc1
      const dot1 = vec.reduce((sum, val, i) => sum + val * pc1[i], 0);
      const proj = vec.map((val, i) => val - dot1 * pc1[i]);
      
      const dot2 = proj.reduce((sum, val, i) => sum + val * pc2[i], 0);
      for (let i = 0; i < dim; i++) nextPc2[i] += dot2 * proj[i];
    }
    const mag = Math.sqrt(nextPc2.reduce((sum, val) => sum + val * val, 0));
    pc2 = nextPc2.map(val => val / mag);
  }

  // 4. Project data onto PC1 and PC2
  return centered.map(vec => ({
    x: vec.reduce((sum, val, i) => sum + val * pc1[i], 0),
    y: vec.reduce((sum, val, i) => sum + val * pc2[i], 0),
  }));
}

/**
 * Calculates the semantic "Resonance" (Centroid) of a group of vectors.
 */
export function calculateCentroid(points: { x: number, y: number }[]): { x: number, y: number } {
  if (points.length === 0) return { x: 0, y: 0 };
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}
