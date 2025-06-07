import * as React from 'react';
import { FlatList, ImageBackground, Platform, View } from 'react-native';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { useEffect, useState } from 'react';
import * as Calendar from 'expo-calendar';
import { toast } from 'sonner-native';
import { cn } from '~/lib/utils';
import storageService from '~/lib/services/storageService';
import { Input } from '~/components/ui/input';

export default function Screen() {
  const [calendarId, setCalendarId] = useState('');
  const [calendarEmail, setCalendarEmail] = useState('');
  const [alarms, setAlarms] = useState<TortureAlarm[]>([]);
  const [isEventCreated, setIsEventCreated] = useState(false);

  const handleSetAlarms = async () => {
    const alarmDates = generateAlarms();
    console.log(
      'Generated alarm dates:',
      alarmDates.map((date) =>
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    );
    setAlarms(
      alarmDates.map((date) => ({
        time: date,
        done: new Date().getTime() > date.getTime(),
      }))
    );

    try {
      for (const event of baseEvents) {
        const eventAlarms = alarmDates.splice(0, 4);
        await Calendar.createEventAsync(calendarId, {
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          creationDate: new Date(),
          alarms: eventAlarms.map(
            (alarm): Calendar.Alarm => ({
              method: Calendar.AlarmMethod.ALERT,
              relativeOffset:
                Math.floor(
                  (event.startDate.getTime() - alarm.getTime()) / (60 * 1000)
                ) * -1,
            })
          ),
        });
      }
      toast.success('Torture event created successfully!');
      setIsEventCreated(true);
    } catch (error) {
      console.error('Error creating events:', error);
      toast.error('Torture event creation failed.');
    }
  };

  const checkIfEventAlreadyCreated = async (calId: string) => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    try {
      const calendarEvents = await Calendar.getEventsAsync(
        [calId],
        startDate,
        endDate
      );
      const tortureEvents = calendarEvents.filter(
        (event) => event.title === EVENT_TITLE
      );

      const newAlarms: TortureAlarm[] = [];
      for (const tortureEvent of tortureEvents) {
        const alarmDates = tortureEvent.alarms
          .filter((alarm) => alarm.relativeOffset)
          .map((alarm) => {
            const alarmTime = new Date(
              new Date(tortureEvent.startDate).getTime() +
                alarm.relativeOffset! * 60 * 1000
            );
            const result: TortureAlarm = {
              time: alarmTime,
              done: new Date().getTime() > alarmTime.getTime(),
            };
            return result;
          });
        newAlarms.push(...alarmDates);
      }

      setAlarms(newAlarms);
      setIsEventCreated(tortureEvents.length > 0);
    } catch (error) {
      console.error('Error checking for existing events:', error);
      setIsEventCreated(false);
    }
  };

  const handleRefresh = () => {
    checkIfEventAlreadyCreated(calendarId).then(() => {
      toast.success('Alarms refreshed successfully!');
    });
  };

  const handleSubmitEmail = () => {
    Calendar.getCalendarsAsync()
      .then((calendars) => {
        const existingCalendar = calendars.find(
          (cal) => cal.title === calendarEmail
        );

        if (existingCalendar) {
          storageService
            .storeData(CALENDAR_ID, existingCalendar.id)
            .then(() => {
              setCalendarId(existingCalendar.id);
              checkIfEventAlreadyCreated(existingCalendar.id);
              toast.success('Calendar found successfully!');
            })
            .catch((error) => {
              console.error('Error storing calendar ID:', error);
              toast.error('Failed to store calendar ID. Please try again.');
            });
        } else {
          toast.warning('Calendar not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching calendars:', error);
        toast.error('Failed to fetch calendars. Please try again.');
      });
  };

  useEffect(() => {
    console.log('Checking for existing torture calendar...');
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        storageService.getData(CALENDAR_ID).then((calendarId) => {
          if (calendarId) {
            setCalendarId(calendarId);
            checkIfEventAlreadyCreated(calendarId);
          }
        });
      }
    })();
  }, []);

  return (
    <ImageBackground
      className="flex-1 justify-center items-center p-6"
      source={require('~/assets/images/appstore.png')}
      resizeMode="repeat"
    >
      <Card className="w-full max-w-sm rounded-2xl pt-6 bg-card/80">
        <CardHeader className="items-center">
          <CardTitle className="pb-2 text-center font-bold">
            Torture of the Day 📢
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!!calendarId ? (
            <FlatList
              data={isEventCreated ? alarms : []}
              keyExtractor={(item) => item.time.toISOString()}
              renderItem={({ item }) => (
                <Text
                  className={cn(
                    'text-lg text-center font-semibold',
                    item.done && 'line-through text-muted-foreground'
                  )}
                >
                  {item.time.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-500">
                  No alarms set yet.
                </Text>
              }
            />
          ) : (
            <Input
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Enter your calendar email address"
              value={calendarEmail}
              onChangeText={setCalendarEmail}
            />
          )}
        </CardContent>
        <CardFooter className="flex-col gap-3">
          {!!calendarId ? (
            !isEventCreated ? (
              <Button
                className="shadow shadow-foreground/5"
                onPress={handleSetAlarms}
              >
                <Text>Set Alarms</Text>
              </Button>
            ) : (
              <Button
                className="shadow shadow-foreground/5"
                onPress={handleRefresh}
              >
                <Text>Refresh</Text>
              </Button>
            )
          ) : (
            <Button
              className="shadow shadow-foreground/5"
              onPress={handleSubmitEmail}
              disabled={!calendarEmail}
            >
              <Text>Submit</Text>
            </Button>
          )}
        </CardFooter>
      </Card>
    </ImageBackground>
  );
}

type TortureAlarm = {
  time: Date;
  done: boolean;
};

type TortureEvent = {
  title: string;
  startDate: Date;
  endDate: Date;
  alarms: Date[];
};

const CALENDAR_ID = 'calendar_id';
const EVENT_TITLE = 'Torture of the day 📢';

const generateDate = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date;
};

const baseStartDate = generateDate(15);

const baseEvents: TortureEvent[] = [
  {
    title: EVENT_TITLE,
    startDate: generateDate(15),
    endDate: generateDate(17),
    alarms: [],
  },
  {
    title: EVENT_TITLE,
    startDate: generateDate(17),
    endDate: generateDate(19),
    alarms: [],
  },
  {
    title: EVENT_TITLE,
    startDate: generateDate(19),
    endDate: generateDate(21),
    alarms: [],
  },
  {
    title: EVENT_TITLE,
    startDate: generateDate(21),
    endDate: generateDate(23),
    alarms: [],
  },
];

const generateAlarms = (): Date[] => {
  // Hardcode start time to 3pm today
  const start = baseStartDate;

  // Hardcode end time to 11pm today
  const end = generateDate(23);

  // Calculate the total available time in minutes between start and end
  const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

  // Generate 16 alarm times
  const alarmTimes: Date[] = [];

  // First alarm should be 24-33 minutes after start
  const firstAlarmOffset = Math.floor(Math.random() * 10) + 24; // Random between 24-33

  // Last alarm should be 1-10 minutes before end
  const endBuffer = Math.floor(Math.random() * 10) + 1; // Random between 1-10

  // Calculate the remaining time available for the 14 middle alarms
  const remainingMinutes = totalMinutes - firstAlarmOffset - endBuffer;

  // Calculate the average gap for the middle 14 alarms
  const averageGap = remainingMinutes / 15;

  // Check if we have enough time for all alarms with required intervals
  if (averageGap < 24) {
    console.warn(
      'Time span too short for 16 alarms with 24-33 minute intervals'
    );
    // Return whatever alarms we can fit while maintaining minimum interval
    return generateMinimalAlarms();
  }

  // Create first alarm
  let currentTime = new Date(start.getTime() + firstAlarmOffset * 60 * 1000);
  alarmTimes.push(new Date(currentTime));

  // Create middle 14 alarms
  for (let i = 1; i < 15; i++) {
    // Generate a random interval between 24-33 minutes
    const interval = Math.floor(Math.random() * 10) + 24; // Random between 24-33
    currentTime = new Date(currentTime.getTime() + interval * 60 * 1000);

    // Safety check - ensure we're not getting too close to the end
    const minutesLeft = (end.getTime() - currentTime.getTime()) / (1000 * 60);
    if (minutesLeft < (16 - i) * 24) {
      // Not enough time left for remaining alarms with minimum interval
      // Adjust the spacing to fit the remaining alarms
      const adjustedInterval = (minutesLeft - endBuffer) / (16 - i);
      if (adjustedInterval < 24) {
        console.warn(
          'Adjusting alarm intervals to fit within time constraints'
        );
      }

      // Recalculate currentTime with adjusted interval
      currentTime = new Date(
        alarmTimes[alarmTimes.length - 1].getTime() +
          Math.max(24, adjustedInterval) * 60 * 1000
      );
    }

    alarmTimes.push(new Date(currentTime));
  }

  // Create the last alarm (1-10 minutes before end)
  alarmTimes.push(new Date(end.getTime() - endBuffer * 60 * 1000));

  return alarmTimes;
};

// Helper function for when time span is too short
const generateMinimalAlarms = (): Date[] => {
  // Hardcode start time to 3pm today
  const start = new Date();
  start.setHours(15, 0, 0, 0);

  // Hardcode end time to 11pm today
  const end = new Date();
  end.setHours(23, 0, 0, 0);

  const alarms: Date[] = [];
  let currentTime = new Date(start.getTime());

  // Use minimum intervals of 24 minutes until we can't fit any more
  while (true) {
    currentTime = new Date(currentTime.getTime() + 24 * 60 * 1000);
    // Stop if we're less than 1 minute from the end
    if ((end.getTime() - currentTime.getTime()) / (1000 * 60) < 1) {
      break;
    }
    alarms.push(new Date(currentTime));
    // Stop if we have 16 alarms
    if (alarms.length >= 16) {
      break;
    }
  }

  return alarms;
};
