@if($ticket = $user->tickets()->first())
    {{ $ticket->name }} | {!! $ticket->number !!}
@endif