/*
 *  NECESSARY LIB FOR WEB SOCKETS
 *  https://github.com/Links2004/arduinoWebSockets
*/

#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#define DEBUG 1

const char* ssid = "WIFI_SSID";
const char* password = "WIFI_PASSWORD";

// WEBSOCKETS' INITIAL MESSAGE PARAMS
int powerA = 0;
int powerB = 0;
char dirA = 'S';
char dirB = 'S';

// MOTORS' PINS
const int enA = 14;
const int inA1 = 16;
const int inA2 = 5;

const int enB = 12;
const int inB1 = 13;
const int inB2 =  15;

WebSocketsServer webSocket = WebSocketsServer(81);

void setup ()
{
// WEBSOCKETS AND SERIAL SETUP
#ifdef DEBUG
    Serial.begin(115200);
    Serial.println("");
#endif
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
#ifdef DEBUG
        Serial.print(".");
#endif
    }

#ifdef DEBUG
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
#endif
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);

// MOTOR PINS SET START
    pinMode(enA, OUTPUT);
    pinMode(inA1, OUTPUT);
    pinMode(inA2, OUTPUT);
    pinMode(enB, OUTPUT);
    pinMode(inB1, OUTPUT);
    pinMode(inB2, OUTPUT);
}

void loop ()
{
    webSocket.loop();
    setMotors();
}

// WEBSOCKETS EVENT HANDLER
void webSocketEvent (uint8_t num, WStype_t type, uint8_t * payload, size_t length)
{
    if (type == WStype_TEXT)
    {
        setSpeedValues(payload, length);
    }
}

// SETS PINS OF MOTORS
void setMotors ()
{
    if (dirA == 'F')
    {
        digitalWrite(inA1, HIGH);
        digitalWrite(inA2, LOW);
    }
    else if (dirA == 'B')
    {
        digitalWrite(inA1, LOW);
        digitalWrite(inA2, HIGH);
    }
    else if (dirA == 'S')
    {
        digitalWrite(inA1, LOW);
        digitalWrite(inA2, LOW);
    }

    if (dirB == 'F')
    {
        digitalWrite(inB1, HIGH);
        digitalWrite(inB2, LOW);
    }
    else if (dirB == 'B')
    {
        digitalWrite(inB1, LOW);
        digitalWrite(inB2, HIGH);
    }
    else if (dirB == 'S')
    {
        digitalWrite(inB1, LOW);
        digitalWrite(inB2, LOW);
    }

    analogWrite(enA, powerA);
    analogWrite(enB, powerB);
}

// WEBSOCKETS MESSAGE PARSER & MOTOR VALUE SETTER
void setSpeedValues (uint8_t* message, size_t m_length)
{
    bool partFlag = 0;
    int counter = 0;
    char pwmA[4];
    char pwmB[4];
    char t_dirA = 'S';
    char t_dirB = 'S';

    for (int i = 0; i < m_length; i++)
    {
        if (message[i] == '-')
        {
            partFlag == 0 ? t_dirA = 'B' : t_dirB = 'B';
            continue;
        }
        else if (message[i] == '|')
        {
            pwmA[counter] = '\n';
            partFlag = 1;
            counter = 0;
            continue;
        }

        if (!partFlag){
            pwmA[counter] = message[i];
            counter ++;
        }
        else
        {
            pwmB[counter] = message[i];
            counter++;
        }

        if (i == m_length - 1){pwmB[counter] = '\n';}
    }

    powerA = atoi(pwmA);
    powerB = atoi(pwmB);

    dirA = powerA > 0 && t_dirA != 'B' ? 'F' : powerA == 0 ? 'S' : t_dirA;
    dirB = powerB > 0 && t_dirB != 'B' ? 'F' : powerB == 0 ? 'S' : t_dirB;

#ifdef DEBUG
    Serial.print("d1: ");
    Serial.print(dirA);
    Serial.print(" | d2: ");
    Serial.print(dirB);
    Serial.print(" | pwmA: ");
    Serial.print(powerA);
    Serial.print(" | pwmB: ");
    Serial.print(powerB);
    Serial.println();
#endif
}