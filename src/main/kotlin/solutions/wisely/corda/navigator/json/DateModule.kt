package solutions.wisely.corda.navigator.json

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.Version
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.DurationSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.MonthDaySerializer
import com.fasterxml.jackson.datatype.jsr310.ser.OffsetDateTimeSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.OffsetTimeSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.YearMonthSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.YearSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.ZoneIdSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.ZonedDateTimeSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.key.ZonedDateTimeKeySerializer
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.MonthDay
import java.time.OffsetDateTime
import java.time.OffsetTime
import java.time.Period
import java.time.Year
import java.time.YearMonth
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

class DateModule : SimpleModule("DateModule", Version.unknownVersion()) {
    init {
        addSerializer(Instant::class.java, InstantSerializer())
        addSerializer(Duration::class.java, DurationSerializer.INSTANCE)
        addSerializer(LocalDateTime::class.java, LocalDateTimeSerializer(DateTimeFormatter.ISO_DATE_TIME))
        addSerializer(LocalDate::class.java, LocalDateSerializer.INSTANCE)
        addSerializer(LocalTime::class.java, LocalTimeSerializer.INSTANCE)
        addSerializer(MonthDay::class.java, MonthDaySerializer.INSTANCE)
        addSerializer(OffsetDateTime::class.java, OffsetDateTimeSerializer.INSTANCE)
        addSerializer(OffsetTime::class.java, OffsetTimeSerializer.INSTANCE)
        addSerializer(
            Period::class.java, ToStringSerializer(
                Period::class.java
            )
        )
        addSerializer(Year::class.java, YearSerializer.INSTANCE)
        addSerializer(YearMonth::class.java, YearMonthSerializer.INSTANCE)
        addSerializer(ZonedDateTime::class.java, ZonedDateTimeSerializer.INSTANCE)
        addSerializer(ZoneId::class.java, ZoneIdSerializer())
        addSerializer(
            ZoneOffset::class.java, ToStringSerializer(
                ZoneOffset::class.java
            )
        )
        addKeySerializer(ZonedDateTime::class.java, ZonedDateTimeKeySerializer.INSTANCE)
    }

    class InstantSerializer : ValueSerializer<Instant>(Instant::class.java) {
        override fun writeValue(value: Instant, gen: JsonGenerator) {
            gen.writeString(DateTimeFormatter.ISO_INSTANT.format(value.atOffset(ZoneOffset.UTC)))
        }
    }
}