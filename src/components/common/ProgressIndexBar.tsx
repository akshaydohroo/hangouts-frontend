import { Box } from '@mui/material'
import React from 'react'

interface ProgressIndexBarProps {
  totalSegments: number
  highlightedIndex: number
}

const ProgressIndexBar: React.FC<ProgressIndexBarProps> = ({
  totalSegments,
  highlightedIndex,
}) => {
  const segments = Array.from({ length: totalSegments }, (_, index) => (
    <Box
      key={index}
      sx={{
        ...styles.segment,
        ...(index === highlightedIndex ? styles.highlighted : {}),
      }}
    />
  ))

  return <Box style={styles.progressBar}>{segments}</Box>
}

export default ProgressIndexBar

const styles = {
  progressBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '3px',
    borderRadius: '10px',
    overflow: 'hidden',
    margin: '2px 5px',
  },
  segment: {
    flex: 1,
    height: '100%',
    backgroundColor: '#800000',
    transition: 'background-color 0.3s ease',
  },
  highlighted: {
    backgroundColor: 'red',
  },
}
