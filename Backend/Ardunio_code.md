// ---------------------- SENSOR A PINS ----------------------
const int trigA = 10;
const int echoA = 11;

// ---------------------- SENSOR B PINS ----------------------
const int trigB = 8;
const int echoB = 9;

// ---------------------- STATE MEMORY -----------------------
int lastA = -1;
int lastB = -1;

// ---------------------- MEASUREMENT FUNCTION ---------------
long readUltrasonic(int trigPin, int echoPin) {
digitalWrite(trigPin, LOW);
delayMicroseconds(2);

digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);

long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout

if (duration == 0) return -1; // no echo
long distance = duration \* 0.034 / 2; // in cm

if (distance > 300) distance = 300; // cap
return distance;
}

// ---------------------- EVEN NUMBER ROUNDING ---------------
int roundToEven(float value) {
int lower = floor(value);
int upper = ceil(value);

if (abs(value - lower) < abs(value - upper))
return (lower % 2 == 0) ? lower : lower - 1;
else
return (upper % 2 == 0) ? upper : upper + 1;
}

// ---------------------- SETUP ------------------------------
void setup() {
pinMode(trigA, OUTPUT);
pinMode(echoA, INPUT);

pinMode(trigB, OUTPUT);
pinMode(echoB, INPUT);

Serial.begin(9600);
}

// ---------------------- MAIN LOOP --------------------------
void loop() {
unsigned long t = millis();

// ---------- SENSOR A ----------
long rawA = readUltrasonic(trigA, echoA);
if (rawA >= 0) {
int evenA = roundToEven(rawA);

    // only send if change >= 2cm
    // FIX: Added || (OR operator) between conditions
    if (lastA == -1 || abs(evenA - lastA) >= 2) {
      lastA = evenA;
      Serial.print("A,");
      Serial.print(evenA);
      Serial.print(",");
      Serial.println(t);
    }

}

// ---------- SENSOR B ----------
long rawB = readUltrasonic(trigB, echoB);
if (rawB >= 0) {
int evenB = roundToEven(rawB);

    // only send if change >= 2cm
    // FIX: Added || (OR operator) between conditions
    if (lastB == -1 || abs(evenB - lastB) >= 2) {
      lastB = evenB;
      Serial.print("B,");
      Serial.print(evenB);
      Serial.print(",");
      Serial.println(t);
    }

}

delay(80); // stable update rate
}
