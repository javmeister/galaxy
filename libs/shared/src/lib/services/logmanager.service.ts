import { Inject, Injectable } from '@angular/core';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

@Injectable()
export class LogManagerService {
  private name = 'LogManagerService';

  level: LogLevel = LogLevel.All;
  logWithDate = true;

  constructor(@Inject('environment') private environment: any,) {
    this.logWithDate = environment.log.date;
    this.level = environment.log.level;
  }

  debug(msg: string, context?: any, data?: any) {
    this.writeToLog(msg, LogLevel.Debug, context, data);
  }

  info(msg: string, context?: any, data?: any) {
      this.writeToLog(msg, LogLevel.Info, context, data);
  }

  warn(msg: string, context?: any, data?: any) {
      this.writeToLog(msg, LogLevel.Warn, context, data);
  }

  error(msg: string, context?: any, data?: any) {
      this.writeToLog(msg, LogLevel.Error, context, data);
  }

  fatal(msg: string, context?: any, data?: any) {
      this.writeToLog(msg, LogLevel.Fatal, context, data);
  }

  log(msg: string, context?: any, data?: any) {
      this.writeToLog(msg, LogLevel.All, context, data);
  }

  private writeToLog(msg: string, level: LogLevel, context?: any, data?: any) {
    if (this.shouldLog(level)) {
        const entry = new LogEntry();
        const name = context ? context.name || context.constructor.name : '';
        entry.message = `${name ? '[' + name + '] ' : ''}${msg}`;
        entry.level = level;
        entry.logWithDate = this.logWithDate;

        this.color(entry.log, entry.level, data);
    }
  }

  private color(msg: string, level: LogLevel, data?: any) {

    let color = '#fff';

    switch (level) {
        case LogLevel.Info:
             color = '#316ed3';
             break;
        case LogLevel.Debug:
            color = '#3fbd3f';
             break;
        case LogLevel.Error:
        case LogLevel.Fatal:
             color = '#ee4e4e';
             break;
        case LogLevel.Warn:
             color = '#ff9900';
             break;
        default:
          color = '#fff';
    }

    data ?
      console.log("%c" + msg, "color:" + color, data) :
      console.log("%c" + msg, "color:" + color);
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All) {
        ret = true;
    }
    return ret;
  }
}


export class LogEntry {
  // Public Properties
  entryDate: Date = new Date();
  message = "";
  level: LogLevel = LogLevel.Debug;
  logWithDate = true;

  get log(): string {
      let ret = "";

      if (this.logWithDate) {
          ret = new Date() + " - ";
      }

      ret += this.message;

      return ret;
  }
}
