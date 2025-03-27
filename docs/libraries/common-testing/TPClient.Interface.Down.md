# Interface: Down

Bringing a service down is not technically a toxic in the implementation of Toxiproxy.
This is done by POSTing to /proxies/{proxy} and setting the enabled field to false.
