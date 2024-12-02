
```markdown
# XML Generation and Email API Documentation

## Overview

This API provides functionality to generate XML data from a predefined JSON structure, compress the XML into a ZIP file, and email it to a specified recipient. This is useful for generating automated reports and distributing them via email.

---

## Base URL

```
http://<your-server-ip>:8000
```

---

## Endpoints

### 1. **Generate XML and Send Email**
- **Endpoint**: `/generate_xml`
- **Method**: `POST`

#### Description:
This endpoint fetches data from the backend (via `main.py`), converts the JSON data into an XML format, compresses the XML file into a ZIP, and emails it to the specified recipient.

#### Request Body:
The API expects a JSON object with the following parameter:
- **`recipient_email`** (string, required): The email address of the recipient.

#### Request Example:
```json
{
  "recipient_email": "recipient@example.com"
}
```

#### Request Headers:
| **Header**          | **Value**             | **Description**                                      |
|---------------------|-----------------------|------------------------------------------------------|
| `Content-Type`      | `application/json`    | Indicates that the request body contains JSON data.  |

#### Response:
- **200 OK**: The XML file was generated, compressed, and emailed successfully.
    ```json
    {
        "message": "XML generated, zipped, and sent via email successfully."
    }
    ```
- **500 Internal Server Error**: If there is an error in processing the request.
    ```json
    {
        "detail": "Failed to process request: <error details>"
    }
    ```

---

## Functional Details

### 1. Data Source
The API integrates with `main.py` to retrieve the JSON data via the `get_final_json` function. This function fetches data from external APIs (Business and Chemical Inventory) and returns a structured JSON object.

### 2. XML Generation
The JSON data is converted to XML using a recursive `json_to_xml` function. The generated XML structure is wrapped within a `<root>` element and written to a file (`Tier2.xml`).

### 3. File Compression
The XML file is compressed into a ZIP archive (`Tier2Report.zip`) for efficient transmission.

### 4. Email Transmission
The ZIP file is sent as an email attachment using SMTP. The email includes:
- **Subject**: `"Your Tier2 Report"`
- **Body**: `"Please find the attached Tier2 Report."`

### 5. Cleanup
Temporary files (`Tier2.xml` and `Tier2Report.zip`) are deleted after the email is sent to ensure proper resource management.

---

## Request Example

### Postman

1. **Method**: `POST`
2. **URL**: `http://127.0.0.1:8000/generate_xml`
3. **Headers**:
    - `Content-Type`: `application/json`
4. **Body**:
   ```json
   {
       "recipient_email": "recipient@example.com"
   }
   ```

### Curl Example:

```bash
curl -X POST "http://127.0.0.1:8000/generate_xml" \
-H "Content-Type: application/json" \
-d '{"recipient_email": "recipient@example.com"}'
```

---

## Key Features
- **Automated XML Generation**: Converts JSON to XML dynamically.
- **File Compression**: Ensures efficient email attachment handling.
- **Email Delivery**: Directly emails the ZIP file to the specified recipient.
- **Error Handling**: Provides meaningful error messages for debugging.

---

## Possible Use Cases
1. **Regulatory Compliance Reporting**:
   - Generate XML reports for regulatory submissions.
2. **Enterprise Automation**:
   - Automate data processing workflows with XML-based integrations.
3. **Data Archiving**:
   - Transform JSON data into XML for storage or legacy system compatibility.
```
