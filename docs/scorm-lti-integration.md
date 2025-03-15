# SCORM and LTI Integration Documentation

This document provides an overview of the SCORM and LTI integration in the Edunexia LMS platform.

## Overview

The Edunexia LMS now supports two major e-learning standards:

1. **SCORM (Sharable Content Object Reference Model)** - Versions 1.2 and 2004
2. **LTI (Learning Tools Interoperability)** - Version 1.3

These integrations allow instructors to:
- Upload and deploy SCORM packages
- Connect external learning tools via LTI
- Track student progress across both types of content
- Integrate with the existing analytics system

## Database Schema

The integration adds several new tables to the database:

### SCORM Tables
- `scorm_packages` - Stores metadata about uploaded SCORM packages
- `scorm_tracking` - Tracks student progress and interaction with SCORM content

### LTI Tables
- `lti_tools` - Stores configuration for external LTI tools
- `lti_sessions` - Manages active LTI sessions
- `lti_progress` - Tracks student progress with LTI tools

## Components

### SCORM Player

The SCORM player component (`src/components/content/scorm-player.tsx`) provides:
- A simplified SCORM API implementation compatible with SCORM 1.2 and 2004
- Progress tracking and reporting
- Session management
- Error handling and recovery

### LTI Player

The LTI player component (`src/components/content/lti-player.tsx`) provides:
- LTI 1.3 launch capabilities
- Secure token-based authentication
- Message passing between the LMS and external tools
- Progress and completion tracking

### Content Editor

The content editor has been extended to support:
- SCORM package uploads
- SCORM version selection
- LTI tool configuration
- Metadata management for both content types

## API Endpoints

### SCORM API

- `POST /api/scorm/tracking` - Save SCORM tracking data
- `GET /api/scorm/tracking` - Retrieve SCORM tracking data

### LTI API

- `POST /api/lti/launch` - Create and initialize LTI sessions
- `GET /api/lti/launch` - Validate LTI session tokens

## Services

### SCORM Service

The SCORM service (`src/lib/services/scorm-service.ts`) provides:
- SCORM package management
- Tracking data storage and retrieval
- Progress analytics integration

### LTI Service

The LTI service (`src/lib/services/lti-service.ts`) provides:
- LTI tool management
- Session creation and validation
- Secure token generation
- Progress tracking

## User Interfaces

### Teacher Interface

Teachers can:
- Upload SCORM packages
- Configure LTI tools
- Preview content before publishing
- Monitor student progress

### Student Interface

Students can:
- Access SCORM content directly in the LMS
- Launch external LTI tools
- Track their own progress
- Resume from their last position

## Implementation Notes

### SCORM Implementation

- Uses a simplified SCORM API wrapper instead of external dependencies
- Supports both SCORM 1.2 and 2004 standards
- Handles common SCORM data model elements
- Tracks completion status, success status, and score

### LTI Implementation

- Implements LTI 1.3 specification
- Supports secure token-based authentication
- Handles message passing between LMS and tools
- Tracks progress and completion

## Testing

To test the SCORM and LTI integration:

1. **SCORM Testing**
   - Upload a valid SCORM 1.2 or 2004 package
   - Launch the content as a student
   - Verify that progress is tracked correctly
   - Test resume functionality

2. **LTI Testing**
   - Configure an LTI 1.3 compatible tool
   - Launch the tool as a student
   - Verify that authentication works correctly
   - Test that progress data is returned to the LMS

## Troubleshooting

### Common SCORM Issues

- **Content doesn't load**: Verify that the entry point URL is correct
- **Progress not saving**: Check browser console for API communication errors
- **Completion not detected**: Verify that the SCORM package is setting the correct status values

### Common LTI Issues

- **Authentication failures**: Verify client ID and deployment ID
- **Tool doesn't launch**: Check that the launch URL is correct and accessible
- **Progress not returning**: Verify that the tool supports sending completion status

## Future Enhancements

Potential future enhancements include:

- Support for xAPI (Experience API/Tin Can API)
- Enhanced analytics for SCORM and LTI content
- Batch import/export of SCORM packages
- LTI Advantage features (Deep Linking, Assignment and Grade Services)
